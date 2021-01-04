import { IconButton, Text, VStack} from "@chakra-ui/core";
import React, {useState, useEffect} from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import db from "../lib/firebase";

const VoteButtons = ({ post }) => {
    const [isVoting, setVoting] = useState(false);
    const [votedPosts, setVotedPosts] = useState([]);

    useEffect(() => {
        //fetches previously voted items from localStorage
        const votesFromLocalStorage = localStorage.getItem("votes") || [];
        let previousVotes = [];

        try {
            //parses values of the item from localStorage. if the value of the
            //items isn't in the array, then JS will throw an error
            previousVotes = JSON.parse(votesFromLocalStorage);
        } catch (error) {
            console.error(error);
        }

        setVotedPosts(previousVotes);
    }, []);

    const handleDisableingOfVoting = (postId) => {
        //this function disables the voting button after a vote
        const previousVotes = votedPosts;
        previousVotes.push(postId);

        setVotedPosts(previousVotes);

        //update the voted item from local storage
        localStorage.setItem("votes", JSON.stringify(votedPosts));
    };

    const handleClick = async (type) => {
        setVoting(true);
        
        //calculates then saves the vote
        let upVotesCount = post.upVotesCount;
        let downVotesCount = post.downVotesCount;

        const date = new Date();

        if (type === "upvote") {
            upVotesCount = upVotesCount + 1;
        } else {
            downVotesCount = downVotesCount + 1;
        }

        await db.collection("posts").doc(post.id).set({
            title: post.title,
            upVotesCount,
            downVotesCount,
            createdAt: post.createdAt,
            updatedAt: date.toUTCString(),
        });

        //disable the voting button after vote
        handleDisableingOfVoting(post.id);
        setVoting(false);
    };

    const checkIfPostIsAlreadyVoted = () => {
        if (votedPosts.indexOf(post.id) > -1) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <>
        <VStack>
            <IconButton
            size="lg"
            colorScheme="blue"
            aria-label="Upvote"
            icon={<FiArrowUp />}
            onClick={() => handleClick("upvote")}
            isLoading={isVoting}
            isDisabled={checkIfPostIsAlreadyVoted()}
            />
            <Text bg="gray.100" rounded="md" w="100%" p={1}>
                {post.upVotesCount}
            </Text>
        </VStack>
        <VStack>
            <IconButton
            size="lg"
            colorScheme="red"
            aria-label="Downvote"
            icon={<FiArrowDown />}
            onClick={() => handleClick("downvote")}
            isLoading={isVoting}
            isDisabled={checkIfPostIsAlreadyVoted()}
            />
            <Text bg="gray.100" rounded="md" w="100%" p={1}>
                {post.downVotesCount}
            </Text>
        </VStack>
        </>
    );
};

export default VoteButtons